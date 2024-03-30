// Import necessary AWS SDK and PapaParse modules, along with the filesystem module.
import {
  S3Client,
  GetObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";
import Papa from "papaparse";
import * as fs from "fs";

// Define constants for the program. You can change those to your desired values

const fields_needed: string[] = ["Source", "Message"]; // Fields to extract from the CSV content. If you need all fields, provide an empty array.

const output_file = "Results.txt"; // Output file name
const s3_bucket = "threatmonitor-assessment-logs"; // S3 bucket name
const output_messageID = true; // Output MessageID field in the results file

// Define interfaces for structured data handling.
interface Files {
  name: string;
  content: string;
}

interface FileData {
  Key: string;
  LastModified: Date;
  ETag: string;
  Size: number;
  StorageClass: string;
  Owner: {
    DisplayName: string;
    ID: string;
  };
}

interface DataRow {
  Timestamp: string;
  LogLevel: string;
  Source: string;
  MessageID: number;
  Message: string;
}

// Extracts file names from the list objects command's response.
function extract_file_keys(bucket_contents: any[] | undefined): string[] {
  if (typeof bucket_contents === "undefined") {
    throw new Error(
      "Error Retrieving Bucket Contents: Bucket contents are undefined"
    );
  }
  let result: string[] = [];

  bucket_contents.forEach((element) => {
    result.push(element.Key);
  });

  return result;
}

// Reads the content of each file from the S3 bucket and returns an array of file names and their contents.
async function read_data(
  s3Client: S3Client,
  files_keys: string[]
): Promise<Files[]> {
  let files: Files[] = [];

  for (const element of files_keys) {
    const command = new GetObjectCommand({
      Bucket: s3_bucket,
      Key: element,
    });

    try {
      const response = await s3Client.send(command);
      const str = await response.Body?.transformToString();
      if (typeof str !== "undefined") {
        files.push({ name: element, content: str });
      }
    } catch (err) {
      throw new Error("Error Reading Data: Unable to read data from S3 bucket");
    }
  }

  return files;
}

// Extracts specified information from the CSV content, formats it as TSV, and appends it to a results file. By default, the function extracts the "MessageID" field unless otherwise specified.
function extract_info(
  data: Files,
  fields: string[],
  isId: boolean = output_messageID
) {
  if (typeof data === "undefined") {
    throw new Error("Error Parsing CSV: Data is undefined");
  }
  const file_name = data.name;
  const contents = data.content;
  const parsedData = Papa.parse<DataRow>(contents, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  const tsvConfig = {
    delimiter: "\t",
    header: true,
    newline: "\r\n",
  };

  if (fields.length === 0) {
    // Appends formatted TSV data to "Results.txt", including a header with the file name.
    fs.appendFileSync(
      output_file,
      `${file_name}: \n${Papa.unparse(
        parsedData.data,
        tsvConfig
      )}\n--------------------------------------------------------------------\n`,
      "utf8"
    );
  } else {
    console.log("hi");
    const extractedFields = parsedData.data.map((row) => {
      let result = isId ? { MessageID: row.MessageID } : {};
      for (const field of fields) {
        result = { ...result, [field]: row[field as keyof DataRow] };
      }
      return result;
    });

    // Appends formatted TSV data to "Results.txt", including a header with the file name.
    fs.appendFileSync(
      output_file,
      `${file_name}: \n${Papa.unparse(
        extractedFields,
        tsvConfig
      )}\n--------------------------------------------------------------------\n`,
      "utf8"
    );
  }
}

// Main function to execute the workflow.
async function main() {
  try {
    const s3Client = new S3Client({});

    // Retrieve a list of all objects in the specified S3 bucket.
    const { Contents } = await s3Client.send(
      new ListObjectsCommand({
        Bucket: s3_bucket,
      })
    );

    console.log(Contents);

    //   const files_keys = extract_file_keys(Contents);
    //   const files_data = await read_data(s3Client, files_keys);

    //   // Process each file to extract information and append to "Results.txt".
    //   for (const file of files_data) {
    //     extract_info(file, fields_needed);
    //   }
  } catch (error) {
    console.error("Error: ", error);
  }
}

// Invoke the main function to start the program.
main();
