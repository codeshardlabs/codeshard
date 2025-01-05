import {
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import React from "react";

const CustomSandpackPreview = ({
  className,
  template,
  files,
  dependencies,
  devDependencies,
}) => {
  return (
    <>
      <SandpackProvider
        files={files}
        template={template}
        customSetup={{
          dependencies,
          devDependencies,
        }}
      >
        <SandpackLayout className={className}>
          <SandpackPreview
            showNavigator={false}
            showOpenInCodeSandbox={false}
            showRefreshButton={false}
            showRestartButton={false}
            showOpenNewtab={false}
          />
        </SandpackLayout>
      </SandpackProvider>
    </>
  );
};

export default CustomSandpackPreview;
