import { IntegrationDepsConfigProvider } from '../integrations/integration-deps-config-provider';
import { IntegrationDeps } from './integration-deps';

export class IntegrationDepsProvider {
  constructor(private readonly integrationDepsConfigProvider: IntegrationDepsConfigProvider) {}

  async get(): Promise<IntegrationDeps> {
    const config = await this.integrationDepsConfigProvider.get();
    return {};
  }
}
