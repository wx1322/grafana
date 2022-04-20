import { AnnotationQuery } from '@grafana/data';
import { AnnotationQueryEditor } from './components/AnnotationQueryEditor';
import { isCloudWatchAnnotation } from './guards';
import { CloudWatchAnnotationQuery, LegacyAnnotationQuery } from './types';

export const CloudWatchAnnotationSupport = {
  prepareAnnotation: (
    query: LegacyAnnotationQuery | AnnotationQuery<CloudWatchAnnotationQuery>
  ): AnnotationQuery<CloudWatchAnnotationQuery> => {
    if (isCloudWatchAnnotation(query)) {
      return query;
    }

    return {
      datasource: query.datasource,
      enable: query.enable,
      iconColor: query.iconColor,
      name: query.name,
      builtIn: query.builtIn,
      hide: query.hide,
      target: {
        ...query.target,
        ...query,
        queryMode: 'Annotations',
        refId: query.refId ?? 'annotationQuery',
      },
    };
  },
  QueryEditor: AnnotationQueryEditor,
};
