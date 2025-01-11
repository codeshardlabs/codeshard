import { redirect } from "next/navigation";
import { templates } from "@/src/utils";
import SandpackEditor from "@/src/components/editor/SandpackEditor";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/src/lib/database";
import { shards } from "@/src/db/schema/shards";

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
  let shardDetails = null;

  try {
    let ans = await db
      .insert(shards)
      .values({
        userId: userId,
        templateType: template,
      })
      .returning();
    if (ans.length == 0) {
      console.log("length 0");
      redirect("/");
    }
    shardDetails = ans[0];
  } catch (error) {
    console.log(error);
  }

  console.log("shard details: ", shardDetails);

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
