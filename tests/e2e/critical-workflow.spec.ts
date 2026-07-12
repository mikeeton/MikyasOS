import { expect, test } from '@playwright/test';

const apiBaseUrl = process.env.E2E_API_URL ?? 'http://localhost:3000/api/v1';

async function apiRequest<T>(
  path: string,
  options: {
    token?: string;
    organisationId?: string;
    method?: string;
    body?: Record<string, unknown>;
  } = {},
): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'content-type': 'application/json',
      ...(options.token ? { authorization: `Bearer ${options.token}` } : {}),
      ...(options.organisationId ? { 'x-organisation-id': options.organisationId } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = (await response.json()) as { data?: T; message?: string };
  if (!response.ok) {
    throw new Error(
      `${options.method ?? 'GET'} ${path} failed: ${response.status} ${payload.message ?? ''}`,
    );
  }

  return payload.data as T;
}

test('critical SaaS workflow appears in the browser', async ({ page }) => {
  const stamp = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const email = `browser-${stamp}@mikyasos.local`;
  const password = 'BrowserE2E!12345';

  const auth = await apiRequest<{ accessToken: string; user: { id: string } }>('/auth/register', {
    method: 'POST',
    body: { name: 'Browser E2E User', email, password },
  });

  const organisation = await apiRequest<{ id: string }>('/organisations', {
    token: auth.accessToken,
    method: 'POST',
    body: {
      name: `Browser E2E Org ${stamp.slice(-6)}`,
      industry: 'Technology',
      companySize: '1-10',
      country: 'US',
      timezone: 'America/New_York',
      currency: 'USD',
    },
  });

  const switched = await apiRequest<{ accessToken: string }>('/auth/switch-organisation', {
    token: auth.accessToken,
    method: 'POST',
    body: { organisationId: organisation.id },
  });

  const token = switched.accessToken;

  const company = await apiRequest<{ id: string; name: string }>('/companies', {
    token,
    organisationId: organisation.id,
    method: 'POST',
    body: {
      name: `Acme Browser ${stamp.slice(-5)}`,
      status: 'CUSTOMER',
      industry: 'Software',
    },
  });

  const project = await apiRequest<{ id: string; name: string }>('/projects', {
    token,
    organisationId: organisation.id,
    method: 'POST',
    body: {
      name: `Browser Delivery ${stamp.slice(-5)}`,
      companyId: company.id,
      status: 'ACTIVE',
      priority: 'HIGH',
      startDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 86_400_000).toISOString(),
    },
  });

  const task = await apiRequest<{ id: string; title: string }>('/tasks', {
    token,
    organisationId: organisation.id,
    method: 'POST',
    body: {
      projectId: project.id,
      title: `Browser task ${stamp.slice(-5)}`,
      status: 'TODO',
      priority: 'HIGH',
      dueDate: new Date(Date.now() - 86_400_000).toISOString(),
    },
  });

  const invoice = await apiRequest<{ id: string; invoiceNumber: string }>('/finance/invoices', {
    token,
    organisationId: organisation.id,
    method: 'POST',
    body: {
      customerId: company.id,
      projectId: project.id,
      invoiceNumber: `BROWSER-${stamp.slice(-6)}`,
      issueDate: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      items: [{ description: 'Browser workflow validation', quantity: 1, unitPrice: 2500 }],
    },
  });

  await page.goto('/login');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /sign in|log in/i }).click();
  await expect(page).toHaveURL(/\/app/);

  await page.goto('/app/today');
  await expect(page.getByText('Today command centre')).toBeVisible();
  await expect(page.getByText('What needs my attention today?')).toBeVisible();
  expect(task.id).toBeTruthy();
  expect(invoice.id).toBeTruthy();

  await page.goto('/app/calendar');
  await expect(page.getByText('Calendar command centre')).toBeVisible();
  await expect(page.getByText(/Day/)).toBeVisible();
  await expect(page.getByText(/Week/)).toBeVisible();

  await page.goto(`/app/projects/${project.id}`);
  await expect(page.getByText(project.name)).toBeVisible();
});
