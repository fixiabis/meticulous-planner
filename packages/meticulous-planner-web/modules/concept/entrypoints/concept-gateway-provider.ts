import { DefaultStore } from '@/modules/base/integrations/default-store';
import { ConceptService } from '../services/concept-service';
import { ConceptGateway } from './concept-gateway';

export class ConceptGatewayProvider {
  async get(): Promise<ConceptGateway> {
    return new ConceptService(
      new DefaultStore(
        () => ({}),
        (values) => values,
      ),
      new DefaultStore(
        () => ({}),
        (values) => values,
      ),
    );
  }
}
