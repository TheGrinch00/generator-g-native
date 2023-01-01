import { ObjectShape } from "yup/lib/object";

export type Modify<R, T> = Omit<R, keyof T> & T;

// This is used to strongly type the form data, for example:
// const schema = yup.object().shape<YupShape<{name: string, surname: string}>>({name: yup.string(), surname: yup.string()});
type ObjectShapeValues = ObjectShape extends Record<string, infer V>
  ? V
  : never;
export type YupShape<T extends Record<any, any>> = Record<
  keyof T,
  ObjectShapeValues
>;
