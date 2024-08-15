import { test, expect } from '@grafana/plugin-e2e';

test('should display time ranges', async ({
  gotoPanelEditPage,
  readProvisionedDashboard,
  page,
}) => {
  const dashboard = await readProvisionedDashboard({ fileName: 'dashboard.json' });
  const panelEditPage = await gotoPanelEditPage({ dashboard, id: '2' });
  await panelEditPage.setVisualization('Pre-Defined-Time-Range'); 
  await expect(page.getByTestId("time-ranges")).toBeTruthy()
});


test('should display no time ranges avaialble if all are removed', async ({
  gotoPanelEditPage,
  readProvisionedDashboard,
  page,
}) => {
  const dashboard = await readProvisionedDashboard({ fileName: 'dashboard.json' });
  const panelEditPage = await gotoPanelEditPage({ dashboard, id: '2' });
  await panelEditPage.setVisualization('Pre-Defined-Time-Range'); 
  for (let i = 0; i < 5; i++) {
    await page.getByTestId("remove-time-range-0").click()
  }  
  await expect(page.getByTestId("no-data")).toBeTruthy()
});
