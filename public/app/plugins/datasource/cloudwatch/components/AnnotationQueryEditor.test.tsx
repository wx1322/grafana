import { QueryEditorProps } from '@grafana/data';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { CloudWatchDatasource } from '../datasource';
import { CloudWatchAnnotationQuery, CloudWatchJsonData, CloudWatchQuery } from '../types';
import { setupMockedDataSource } from '../__mocks__/CloudWatchDataSource';
import { AnnotationQueryEditor } from './AnnotationQueryEditor';

const ds = setupMockedDataSource({
  variables: [],
});

const q: CloudWatchQuery = {
  queryMode: 'Annotations',
  region: 'us-east-2',
  namespace: '',
  period: '',
  metricName: '',
  dimensions: {},
  matchExact: true,
  statistic: '',
  refId: '',
  name: '',
  prefixMatching: false,
  actionPrefix: '',
  alarmNamePrefix: '',
  enable: true,
  iconColor: '',
};

ds.datasource.getRegions = jest.fn().mockResolvedValue([]);
ds.datasource.getNamespaces = jest.fn().mockResolvedValue([]);
ds.datasource.getMetrics = jest.fn().mockResolvedValue([]);
ds.datasource.getDimensionKeys = jest.fn().mockResolvedValue([]);
ds.datasource.getVariables = jest.fn().mockReturnValue([]);

const props: QueryEditorProps<CloudWatchDatasource, CloudWatchQuery, CloudWatchJsonData> = {
  datasource: ds.datasource,
  query: q,
  onChange: jest.fn(),
  onRunQuery: jest.fn(),
};

describe('AnnotationQueryEditor', () => {
  it('should not display match exact switch', async () => {
    render(<AnnotationQueryEditor {...props} />);
    await waitFor(() => {
      expect(screen.queryByText('Match exact')).toBeNull();
    });
  });

  it('should not display wildcard option in dimension value dropdown', async () => {
    ds.datasource.getDimensionValues = jest.fn().mockResolvedValue([[{ label: 'dimVal1', value: 'dimVal1' }]]);
    (props.query as CloudWatchAnnotationQuery).dimensions = { instanceId: 'instance-123' };
    render(<AnnotationQueryEditor {...props} />);
    const valueElement = screen.getByText('instance-123');
    expect(valueElement).toBeInTheDocument();
    expect(screen.queryByText('*')).toBeNull();
    valueElement.click();
    await waitFor(() => {
      expect(screen.queryByText('*')).toBeNull();
    });
  });
});
