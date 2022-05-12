import { IFieldMapping } from '../types/types';

class FieldGroupByModifier {
  public fields: string[];
  public fieldMask: IFieldMapping;

  constructor(fields: string[], fieldMask: IFieldMapping) {
    this.fields = fields;
    this.fieldMask = fieldMask;
  }

  modify() {
    this.fields.map(field => {
      const cleanField: string = field.replace(/\s+/g, ' ').trim();
      if (field.includes(' as ')) {
        return cleanField.split(' as ')[0];
      } else {
        return cleanField;
      }
    });
  }
}

export default FieldGroupByModifier;
