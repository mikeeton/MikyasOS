import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { z } from 'zod';

import { crmApi } from '@/api/client';
import { Button } from '@/components/ui/button';
import { queryClient } from '@/lib/query-client';
import { CrmErrorState, CrmShell, CrmSkeleton } from '../components/crm-shell';
import { useCrmContext } from '../hooks/use-crm-context';

const contactSchema = z.object({
  companyId: z.string().optional(),
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.string().email('Use a valid email.').optional().or(z.literal('')),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  linkedin: z.string().optional(),
  birthday: z.string().optional(),
  notes: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, organisationId, enabled } = useCrmContext();
  const contact = useQuery({
    queryKey: ['crm', 'contact', organisationId, id],
    queryFn: () => crmApi.contact(token!, organisationId!, id!),
    enabled: enabled && mode === 'edit' && Boolean(id),
  });
  const companies = useQuery({
    queryKey: ['crm', 'companies', organisationId, 'for-contact-form'],
    queryFn: () => crmApi.companies(token!, organisationId!, { pageSize: 100 }),
    enabled,
  });
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { firstName: '', lastName: '', companyId: '' },
  });
  const mutation = useMutation({
    mutationFn: (values: ContactFormValues) => {
      const body = { ...values, companyId: values.companyId || undefined };
      return mode === 'edit' && id
        ? crmApi.updateContact(token!, organisationId!, id, body)
        : crmApi.createContact(token!, organisationId!, body);
    },
    onSuccess: (saved) => {
      void queryClient.invalidateQueries({ queryKey: ['crm', 'contacts'] });
      void navigate(`/app/crm/contacts/${saved.id}`);
    },
  });

  useEffect(() => {
    if (contact.data) {
      form.reset({
        companyId: contact.data.companyId ?? '',
        firstName: contact.data.firstName,
        lastName: contact.data.lastName,
        email: contact.data.email ?? '',
        phone: contact.data.phone ?? '',
        mobile: contact.data.mobile ?? '',
        jobTitle: contact.data.jobTitle ?? '',
        department: contact.data.department ?? '',
        linkedin: contact.data.linkedin ?? '',
        birthday: contact.data.birthday?.slice(0, 10) ?? '',
        notes: contact.data.notes ?? '',
      });
    }
  }, [contact.data, form]);

  return (
    <CrmShell
      title={mode === 'edit' ? 'Edit contact' : 'Create contact'}
      description="Keep the human relationship clear: role, company, communication details, and notes."
    >
      {contact.isLoading ? (
        <CrmSkeleton rows={5} />
      ) : contact.isError ? (
        <CrmErrorState onRetry={() => void contact.refetch()} />
      ) : (
        <form
          onSubmit={(event) => {
            void form.handleSubmit((values) => mutation.mutate(values))(event);
          }}
          className="grid gap-6 premium-card p-5"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Company">
              <select {...form.register('companyId')} className="premium-input">
                <option value="">No company</option>
                {companies.data?.items.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Job title">
              <input {...form.register('jobTitle')} className="premium-input" />
            </Field>
            <Field label="First name" error={form.formState.errors.firstName?.message}>
              <input {...form.register('firstName')} className="premium-input" />
            </Field>
            <Field label="Last name" error={form.formState.errors.lastName?.message}>
              <input {...form.register('lastName')} className="premium-input" />
            </Field>
            <Field label="Email" error={form.formState.errors.email?.message}>
              <input {...form.register('email')} className="premium-input" />
            </Field>
            <Field label="Phone">
              <input {...form.register('phone')} className="premium-input" />
            </Field>
            <Field label="Mobile">
              <input {...form.register('mobile')} className="premium-input" />
            </Field>
            <Field label="Department">
              <input {...form.register('department')} className="premium-input" />
            </Field>
            <Field label="LinkedIn">
              <input {...form.register('linkedin')} className="premium-input" />
            </Field>
            <Field label="Birthday">
              <input type="date" {...form.register('birthday')} className="premium-input" />
            </Field>
          </div>
          <label className="grid gap-2 text-sm font-medium">
            <span>Notes</span>
            <textarea
              {...form.register('notes')}
              rows={5}
              className="premium-input min-h-28 py-2"
            />
          </label>
          <div className="flex justify-end border-t border-border pt-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save contact'}
            </Button>
          </div>
        </form>
      )}
    </CrmShell>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      <span>{label}</span>
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  );
}
