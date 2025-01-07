import { Schema } from "mongoose";

export const fileSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    default: "",
  },
  readOnly: {
    type: Boolean,
    default: false,
  }, // Set as non-editable, defaults to `false`
  active: {
    type: Boolean,
    default: false,
  }, // Set as main file, defaults to `false`
  hidden: {
    type: Boolean,
    default: false,
  }, // Tab visibility, defaults to `false`
});
