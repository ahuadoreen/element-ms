import { DirectiveBinding } from "vue";
import useUserStore from "~/store/userStore";
import { SUPER_ADMIN_ROLE_NAME } from "~/utils/constant";

export const acl = (el: HTMLElement, binding: DirectiveBinding) => {
  const user = useUserStore().user;
  if (!user) {
    el.style.display = "none";
    return;
  }
  const roles = user!.roles;
  if (!roles || roles.length == 0) {
    el.style.display = "none";
    return;
  }
  const superAdmin = roles.find((r) => r.roleName == SUPER_ADMIN_ROLE_NAME);
  if (!superAdmin) {
    const acls = user!.authList;
    if (!acls || acls.length == 0 || !acls.includes(binding.value)) {
      el.style.display = "none";
    }
  }
};
