import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { z } from 'zod';

import { crmApi } from '@/api/client';
import { Button } from '@/components/ui/button';
import { queryClient } from '@/lib/query-client';
import { CrmErrorState, CrmShell, CrmSkeleton } from '../components/crm-shell';
import { useCrmContext } from '../hooks/use-crm-context';

const companySchema = z.object({
  name: z.string().min(2, 'Company name is required.'),
  legalName: z.string().optional(),
  website: z.string().optional(),
  email: z.string().email('Use a valid email.').optional().or(z.literal('')),
  phone: z.string().optional(),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  annualRevenue: z.coerce.number().min(0).optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  postcode: z.string().optional(),
  linkedin: z.string().optional(),
  status: z.string(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

export function CompanyFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, organisationId, enabled } = useCrmContext();
  const company = useQuery({
    queryKey: ['crm', 'company', organisationId, id],
    queryFn: () => crmApi.company(token!, organisationId!, id!),
    enabled: enabled && mode === 'edit' && Boolean(id),
  });
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: { name: '', status: 'PROSPECT' },
  });
  const mutation = useMutation({
    mutationFn: (values: CompanyFormValues) =>
      mode === 'edit' && id
        ? crmApi.updateCompany(token!, organisationId!, id, values)
        : crmApi.createCompany(token!, organisationId!, values),
    onSuccess: (saved) => {
      void queryClient.invalidateQueries({ queryKey: ['crm', 'companies'] });
      void navigate(`/app/crm/companies/${saved.id}`);
    },
  });

  useEffect(() => {
    if (company.data) {
      form.reset({
        name: company.data.name,
        legalName: company.data.legalName ?? '',
        website: company.data.website ?? '',
        email: company.data.email ?? '',
        phone: company.data.phone ?? '',
        industry: company.data.industry ?? '',
        companySize: company.data.companySize ?? '',
        annualRevenue: Number(company.data.annualRevenue ?? 0),
        country: company.data.country ?? '',
        city: company.data.city ?? '',
        address: company.data.address ?? '',
        postcode: company.data.postcode ?? '',
        linkedin: company.data.linkedin ?? '',
        status: company.data.status,
      });
    }
  }, [company.data, form]);

  return (
    <CrmShell
      title={mode === 'edit' ? 'Edit company' : 'Create company'}
      description="Capture enough customer context to make the next relationship action obvious."
    >
      {company.isLoading ? (
        <CrmSkeleton rows={5} />
      ) : company.isError ? (
        <CrmErrorState onRetry={() => void company.refetch()} />
      ) : (
        <form
          onSubmit={(event) => {
            void form.handleSubmit((values) => mutation.mutate(values))(event);
          }}
          className="grid gap-6 premium-card p-5"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Company name" error={form.formState.errors.name?.message}>
              <input {...form.register('name')} className="premium-input" />
            </Field>
            <Field label="Legal name">
              <input {...form.register('legalName')} className="premium-input" />
            </Field>
            <Field label="Website">
              <input {...form.register('website')} className="premium-input" />
            </Field>
            <Field label="Email" error={form.formState.errors.email?.message}>
              <input {...form.register('email')} className="premium-input" />
            </Field>
            <Field label="Phone">
              <input {...form.register('phone')} className="premium-input" />
            </Field>
            <Field label="Industry">
              <input {...form.register('industry')} className="premium-input" />
            </Field>
            <Field label="Company size">
              <input {...form.register('companySize')} className="premium-input" />
            </Field>
            <Field label="Annual revenue">
              <input type="number" {...form.register('annualRevenue')} className="premium-input" />
            </Field>
            <Field label="Country">
              <input {...form.register('country')} className="premium-input" />
            </Field>
            <Field label="City">
              <input {...form.register('city')} className="premium-input" />
            </Field>
            <Field label="Address">
              <input {...form.register('address')} className="premium-input" />
            </Field>
            <Field label="Status">
              <select {...form.register('status')} className="premium-input">
                {[
                  'PROSPECT',
                  'ACTIVE',
                  'INACTIVE',
                  'CUSTOMER',
                  'PARTNER',
                  'SUPPLIER',
                  'ARCHIVED',
                ].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Real-time validation is active. Draft preservation is ready for a later milestone.
            </p>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save company'}
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
