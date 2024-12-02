import { acl } from "./acl";

export default function registerDirectives(app: any) {
  app.directive("acl", acl);
}
