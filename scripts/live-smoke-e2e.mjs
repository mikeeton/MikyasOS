const API_URL = process.env.API_URL ?? 'http://localhost:3000/api/v1';
const WEB_URL = process.env.WEB_URL ?? 'http://localhost:5173';

const runId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const email = `smoke-${runId}@mikyasos.local`;
const password = 'SmokeTest123!';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(options.token ? { authorization: `Bearer ${options.token}` } : {}),
      ...(options.organisationId ? { 'x-organisation-id': options.organisationId } : {}),
      ...(options.headers ?? {}),
    },
  });
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      `${options.method ?? 'GET'} ${path} failed: ${response.status} ${JSON.stringify(body)}`,
    );
  }

  return body?.data ?? body;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  const webResponse = await fetch(WEB_URL);
  assert(webResponse.ok, `Web did not return 200: ${webResponse.status}`);

  const live = await request('/health/live');
  assert(live.status === 'ok', 'API liveness did not return ok');

  const unauthenticated = await fetch(`${API_URL}/auth/me`);
  assert(
    unauthenticated.status === 401,
    `Protected auth/me should return 401, got ${unauthenticated.status}`,
  );

  const registered = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      name: 'Smoke Test User',
    }),
  });
  assert(registered.accessToken, 'Register did not return access token');

  const token = registered.accessToken;
  const organisation = await request('/organisations', {
    method: 'POST',
    token,
    body: JSON.stringify({
      name: `Smoke Org ${runId}`,
      industry: 'Technology',
      companySize: '1-10',
      country: 'US',
      timezone: 'America/New_York',
      currency: 'USD',
    }),
  });
  assert(organisation.id, 'Organisation create did not return id');

  const switched = await request('/auth/switch-organisation', {
    method: 'POST',
    token,
    body: JSON.stringify({ organisationId: organisation.id }),
  });
  const activeToken = switched.accessToken ?? token;

  const company = await request('/companies', {
    method: 'POST',
    token: activeToken,
    organisationId: organisation.id,
    body: JSON.stringify({
      name: `Smoke Customer ${runId}`,
      email: `customer-${runId}@example.com`,
      industry: 'Software',
      status: 'CUSTOMER',
    }),
  });
  assert(company.id, 'Company create did not return id');

  const project = await request('/projects', {
    method: 'POST',
    token: activeToken,
    organisationId: organisation.id,
    body: JSON.stringify({
      companyId: company.id,
      name: `Smoke Project ${runId}`,
      description: 'Live smoke test project',
      status: 'ACTIVE',
      priority: 'HIGH',
      progress: 10,
      budget: 1000,
    }),
  });
  assert(project.id, 'Project create did not return id');

  const invoice = await request('/finance/invoices', {
    method: 'POST',
    token: activeToken,
    organisationId: organisation.id,
    body: JSON.stringify({
      customerId: company.id,
      projectId: project.id,
      invoiceNumber: `SMOKE-${runId}`,
      currency: 'USD',
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      items: [{ description: 'Smoke test service', quantity: 1, unitPrice: 100 }],
    }),
  });
  assert(invoice.id, 'Invoice create did not return id');

  const crmSearch = await request(`/crm/search?q=${encodeURIComponent(runId)}`, {
    token: activeToken,
    organisationId: organisation.id,
  });
  assert(crmSearch.results.companies.length >= 1, 'CRM search did not find created company');

  const projectSearch = await request(`/project-search?q=${encodeURIComponent(runId)}`, {
    token: activeToken,
    organisationId: organisation.id,
  });
  assert(projectSearch.results.projects.length >= 1, 'Project search did not find created project');

  const event = await request('/analytics/events', {
    method: 'POST',
    token: activeToken,
    organisationId: organisation.id,
    body: JSON.stringify({
      name: 'smoke_e2e_completed',
      source: 'live_smoke_e2e',
      metadata: { companyId: company.id, projectId: project.id, invoiceId: invoice.id },
    }),
  });
  assert(event.id, 'Product analytics event was not recorded');

  const me = await request('/auth/me', { token: activeToken });
  assert(me.email === email, 'auth/me did not return the smoke user');

  console.log(
    JSON.stringify(
      {
        status: 'ok',
        api: API_URL,
        web: WEB_URL,
        email,
        organisationId: organisation.id,
        companyId: company.id,
        projectId: project.id,
        invoiceId: invoice.id,
        analyticsEventId: event.id,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
