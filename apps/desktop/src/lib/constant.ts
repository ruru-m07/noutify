import os from "os";
import path from "path";

export const GENERATE_GITHUB_TOKEN_URL =
  "https://github.com/settings/tokens/new?scopes=notifications,write:discussion,project,repo,gist,workflow,admin:org,admin:repo_hook,admin:org_hook,admin:enterprise,admin:pre_receive_hook,admin:org_permissions,admin:org_secrets,admin:org_runner,admin:enterprise,user,write:packages,read:packages,admin:packages,read:org,read:repo_hook,read:org_hook,read:enterprise,read:pre_receive_hook,read:org_permissions,read:org_secrets,read:org_runner,read:enterprise";

export const LOCAL_STORAGE_KEY = "app_notifications_cache";
export const USER_STORAGE_KEY = "app_user_cache";

export const TEMP_CODE_FILE = path.join(
  os.tmpdir(),
  "device-auth-code-noutify.json"
);

export const TEMP_USER_CONTENT = path.join(os.tmpdir(), "user-content.json");
