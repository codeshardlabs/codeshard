import { redirect } from "next/navigation";
import { templates } from "@/src/utils";
import SandpackEditor from "@/components/SandpackEditor";
import { auth } from "@/auth";
import { Shard } from "@/src/models/Shard";
import connectToDB from "@/src/lib/database";

const page = async ({ params }) => {
  const template = params.template;
  const session = await auth();
  connectToDB();
  if (!templates.includes(template)) {
    // TODO: Give Error Info. to user using modal or alert.
    console.log("Template not valid: ", template);
    console.log("Supported Options: ", templates.join(", "));
    redirect("/");
  }

  if (!session) {
    console.log("session not present");
    redirect("/");
  }

  console.log("Session user: ", session?.user?.name);
  let shardDetails = null;

  try {
    shardDetails = await Shard.create({
      creator: session?.user?.name,
      isTemplate: true,
      templateType: template,
    });
  } catch (error) {
    console.log(error);
  }

  return (
    <div>
      <SandpackEditor
        shardDetails={JSON.stringify(shardDetails)}
        template={template}
        shard={true}
        id={shardDetails?._id.toString() ?? null}
      />
    </div>
  );
};

export default page;
