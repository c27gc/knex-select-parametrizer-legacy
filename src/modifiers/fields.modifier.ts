
import { IFieldMapping, IFieldMatch } from '../types/types';

class FieldModifier {
  public fields: string[];
  public fieldMask: IFieldMapping;
  private strictFields: boolean | undefined;

  constructor(fields: string[], fieldMask: IFieldMapping, strictFields?: boolean) {
    this.fields = fields;
    this.fieldMask = fieldMask;
    this.strictFields = strictFields;
  }

  fieldStrictMode() {

    const fieldMappingKeys = Object.keys(this.fieldMask);
    let newQueryParameters: string[] = fieldMappingKeys.reduce((accumulate: string[], current: string) => {
      let newField: string | undefined;
      if (
        this.fields &&
        this.fields.some(field => {
          const cleanField = field.replace(/\s+/g, ' ').trim();
          const included = cleanField.includes(current + ' as ') || field == current;
          newField = included ? cleanField : undefined;

          // this works because some stops when it finds the first match, and returns the correct value in newField
          return included;
        })
      ) {
        newField && accumulate.push(newField);
      }

      return accumulate;
    }, []);
    return newQueryParameters;
  }

  execute(aggregateField?: string) {

    if (this.strictFields) {
      this.fieldStrictMode();
    }

    const aliasInformation = this.fields.reduce((accumulate: { [key: string]: IFieldMatch }, current: string) => {
      const fieldClean: string = current.replace(/\s+/g, ' ').trim();

      if (fieldClean.includes(' as ')) {
        const internalAlias: string = fieldClean.split(' as ')[0];
        const externalAlias: string = fieldClean.split(' as ')[1];

        if (internalAlias == aggregateField || externalAlias == aggregateField) {
          return accumulate;
        }

        accumulate[internalAlias] = {
          internalAlias,
          externalAlias
        }


        return accumulate;

      } else {
        const internalAlias: string = fieldClean;
        const externalAlias = undefined;

        if (this.fieldMask[internalAlias]) {
          accumulate[internalAlias] = {
            internalAlias,
            externalAlias
          }

        } else if (aggregateField) {
          return accumulate;
        } else {
          throw new Error(`Field ${internalAlias} is not defined in the field mask`);
        }

        return accumulate

      }

    }, {});

    const finalAlias = Object.values(aliasInformation).reduce((accumulate: { [key: string]: string }, current: IFieldMatch) => {

      if (current.externalAlias) {
        accumulate[current.internalAlias] = current.externalAlias;
      } else {
        accumulate[current.internalAlias] = current.internalAlias;
      }

      return accumulate;

    }, {})

    const alias = Object.values(finalAlias);

    const duplicatedAlias = alias.filter((value, index, self) => self.indexOf(value) !== index);

    if (duplicatedAlias.length > 0) {
      throw new Error(`Duplicated alias: ${duplicatedAlias.join(', ')}.`);
    }

    return Object.keys(aliasInformation).map(internalAlias => {
      return `${this.fieldMask[internalAlias].trim()} as ${finalAlias[internalAlias].trim()}`;
    })

  }
}

export default FieldModifier;