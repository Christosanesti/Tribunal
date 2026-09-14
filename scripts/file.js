import { canWrite } from "./check-write";
import { node } from "./node";
import { read } from "./read";
import { readRecursive } from "./readRecursive";
import { remove } from "./remove";
import { write } from "./write";
import { writeProtected } from "./writeProtected";

export const file = {
  canWrite,
  node,
  read,
  readRecursive,
  remove,
  write,
  writeProtected,
};
