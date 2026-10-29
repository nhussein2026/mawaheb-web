import React from "react";
import { PageHeader } from "../ui/PageHeader";

/**
 * Page title block for Workspace views. Delegates to the shared PageHeader
 * (§4.7): breadcrumb and scope tag come from the shell.
 */
export function AdminPageHeader({ title, description, className, actions = null, ...rest }) {
  return <PageHeader title={title} description={description} actions={actions} className={className} {...rest} />;
}
