import { readFileSync } from "fs";
import FormData from "form-data";
import axios from "axios";
import { basename } from "path";

const filePath = "./test.pdf";

async function testUpload() {
  const formData = new FormData();

  // 支持本地文件上传
  const fileBuffer = readFileSync(filePath);
  formData.append("file", fileBuffer, {
    filename: basename(filePath),
  });

  formData.append("to_lang", "zh");
  formData.append("from_lang", "en");

  try {
    const response = await axios.post(
      `https://api.suppr.wilddata.cn/v1/translations`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer sk-Ml7qfE0vR9V-acVhue9xNKZIuMprW3ZP2F1F0apLFJY`,
        },
      }
    );

    const result = response.data;

    if (result.code !== 0) {
      throw new Error(result.msg || "API request failed");
    }

    return result.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data;
      throw new Error(
        `API request failed: ${error.response?.status} ${
          error.response?.statusText
        }. ${JSON.stringify(errorData)}`
      );
    }
    throw error;
  }
}

testUpload();
