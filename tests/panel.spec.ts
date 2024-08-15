import { test, expect } from '@grafana/plugin-e2e';

test('should display time ranges', async ({
  gotoPanelEditPage,
  readProvisionedDashboard,
  page,
}) => {
  const dashboard = await readProvisionedDashboard({ fileName: 'dashboard.json' });
  const panelEditPage = await gotoPanelEditPage({ dashboard, id: '2' });
  await panelEditPage.setVisualization('Pre-Defined-Time-Range');
  await expect(page.getByTestId("time-ranges")).toBeVisible();
});
