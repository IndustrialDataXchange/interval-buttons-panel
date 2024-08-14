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

// test('should display circle when data is passed to the panel', async ({
//   panelEditPage,
//   readProvisionedDataSource,
//   page,
// }) => {
//   const ds = await readProvisionedDataSource({ fileName: 'datasources.yml' });
//   await panelEditPage.datasource.set(ds.name);
//   await panelEditPage.setVisualization('Pre-Defined-Time-Range');
//   await expect(page.getByTestId('simple-panel-circle')).toBeVisible();
// });

// test('should display series counter when "Show series counter" option is enabled', async ({
//   panelEditPage,
//   readProvisionedDataSource,
//   page,
//   selectors,
// }) => {
//   const ds = await readProvisionedDataSource({ fileName: 'datasources.yml' });
//   await panelEditPage.datasource.set(ds.name);
//   await panelEditPage.setVisualization('Pre-Defined-Time-Range');
//   await panelEditPage.collapseSection('Pre-Defined-Time-Range');
//   await expect(page.getByTestId('simple-panel-circle')).toBeVisible();
//   const showSeriesSwitch = panelEditPage
//     .getByGrafanaSelector(
//       selectors.components.PanelEditor.OptionsPane.fieldLabel('Pre-Defined-Time-Range Show series counter')
//     )
//     .getByLabel('Toggle switch');
//   await showSeriesSwitch.click();
//   await expect(page.getByTestId('simple-panel-series-counter')).toBeVisible();
// });
