import { redirect } from "next/navigation";
import { templates } from "@/src/utils";
import SandpackEditor from "@/src/components/editor/SandpackEditor";
import { auth, currentUser } from "@clerk/nextjs/server";
import { create, createShard, handleFailureCase, logFailureCb } from "@/src/lib/actions";

const page = async ({ params }) => {
  const template = params.template;
  const { userId } = await auth();
  const user = await currentUser();
  if (!templates.includes(template)) {
    // TODO: Give Error Info. to user using modal or alert.
    console.log("Template not valid: ", template);
    console.log("Supported Options: ", templates.join(", "));
    redirect("/");
  }

  if (!userId) {
    console.log("session not present");
    redirect("/");
  }

  console.log("Session user: ", user.username);
  const out =   await createShard(userId, {
      templateType: template,
      mode: "normal",
      type: "public"
    })

  handleFailureCase(out, ["shard"], {src: "createShard()", redirectUri: "/"}, logFailureCb);
  let shardDetails = out.data.shard;
  shardDetails["files"] = [];
  shardDetails["dependencies"] = [];

  return (
    <div>
      {shardDetails && (
        <SandpackEditor
          shardDetails={JSON.stringify(shardDetails)}
          template={template}
          shard={true}
          id={shardDetails?.id ?? null}
        />
      )}
    </div>
  );
};

export default page;
