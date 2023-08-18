import { Entity } from "./Entity";

interface Viewer extends Entity {}

interface RestrictedField<T> {
  viewers: Viewer[];
  value: T;
}