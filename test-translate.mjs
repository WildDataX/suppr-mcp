import { SupprClient } from "./dist/index.js";

const apiKey = process.env.SUPPR_API_KEY;
if (!apiKey) {
  console.error("Error: SUPPR_API_KEY environment variable is required");
  process.exit(1);
}

const client = new SupprClient(apiKey);

async function testTranslate() {
  try {
    console.log("📄 正在创建翻译任务...");
    const result = await client.createTranslation({
      file_path: "./test.pdf",
      to_lang: "zh",
      optimize_math_formula: false, // 根据规范，PDF翻译禁止开启公式优化
    });

    console.log("\n✅ 翻译任务创建成功:");
    console.log(JSON.stringify(result, null, 2));

    const taskId = result.task_id;
    console.log(`\n📋 任务ID: ${taskId}`);

    // 查询任务状态
    console.log("\n⏳ 正在查询任务状态...");
    const status = await client.getTranslation(taskId);
    console.log("\n当前状态:");
    console.log(JSON.stringify(status, null, 2));
  } catch (error) {
    console.error("\n❌ 错误:", error.message);
  }
}

testTranslate();
