import { Description } from './description';
import { AttributeId, Language, ParameterId } from './values';

export type ConstraintProps = {
  readonly attributeIds: AttributeId[];
  readonly parameterIds: ParameterId[];
  readonly descriptions: Record<Language, Description>;
};

export class Constraint implements ConstraintProps {
  readonly attributeIds: AttributeId[];
  readonly parameterIds: ParameterId[];
  readonly descriptions: Record<Language, Description>;

  constructor(props: ConstraintProps) {
    this.attributeIds = props.attributeIds;
    this.parameterIds = props.parameterIds;
    this.descriptions = props.descriptions;
  }
}
