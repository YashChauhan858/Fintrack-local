// export const generatePrompt = (headers: string[]) => `
// You are an expert at analyzing bank statement CSV headers and mapping them to standardized financial data fields.

// CSV Headers to Analyze:
// ${headers.join(", ")}

// Task: Map each header to the most appropriate standardized field below.

// Required Output Fields:
// - date: Transaction date/timestamp
// - credit: Money received/deposited (positive amounts)
// - debit: Money spent/withdrawn (negative amounts)
// - account: Account numbers, UPI IDs, beneficiary/counterparty details
// - description: Transaction details, merchant names, remarks, references

// Mapping Guidelines:
// 1. Look for exact matches first, then semantic matches
// 2. Common patterns to recognize:
//    - Date: "Date", "Transaction Date", "Txn Date", "Value Date", "Posted Date"
//    - Credit: "Credit", "Deposit", "Credit Amount", "Received", "Inward", "CR"
//    - Debit: "Debit", "Withdrawal", "Debit Amount", "Paid", "Outward", "DR"
//    - Account: "Account", "UPI ID", "Beneficiary", "Counterparty", "Party Name", "From/To"
//    - Description: "Description", "Remarks", "Details", "Reference", "Narration", "Purpose"
// 3. If multiple headers could match one field, choose the most specific/relevant one
// 4. Some banks use combined amount columns - look for "Amount" with separate debit/credit indicators
// 5. Set value to empty string "" if no suitable header exists

// Output exactly this format with no additional text:
// \`\`\`
// {
//   date: "<header_name_or_empty_string>",
//   credit: "<header_name_or_empty_string>",
//   debit: "<header_name_or_empty_string>",
//   account: "<header_name_or_empty_string>",
//   description: "<header_name_or_empty_string>"
// }
// \`\`\`
// `;

export const generatePrompt = (headers: string[]) => `
You are an expert at analyzing bank statement CSV headers and mapping them to standardized financial data fields.

CSV Headers to Analyze:
${headers.join(", ")}

Task: Map each header to the most appropriate standardized field below.

Required Output Fields:
- date: Transaction date/timestamp
- credit: Money received/deposited (positive amounts)
- debit: Money spent/withdrawn (negative amounts)
- account: Account numbers, UPI IDs, beneficiary/counterparty details
- description: Transaction details, merchant names, remarks, references

Mapping Guidelines:
1. Look for exact matches first, then semantic matches
2. Common patterns to recognize:
   - Date: "Date", "Transaction Date", "Txn Date", "Value Date", "Posted Date"
   - Credit: "Credit", "Deposit", "Credit Amount", "Received", "Inward", "CR"
   - Debit: "Debit", "Withdrawal", "Debit Amount", "Paid", "Outward", "DR"
   - Account: "Account", "UPI ID", "Beneficiary", "Counterparty", "Party Name", "From/To"
   - Description: "Description", "Remarks", "Details", "Reference", "Narration", "Purpose"
3. If multiple headers could match one field, choose the most specific/relevant one
4. Some banks use combined amount columns - look for "Amount" with separate debit/credit indicators
5. Set value to empty string "" if no suitable header exists

// ↓ Only this section changed
Wrap your answer in <mapping> tags containing only a raw JSON object.
No markdown, no backticks, no explanation inside the tags.

<mapping>
{
  "date": "<header_name_or_empty_string>",
  "credit": "<header_name_or_empty_string>",
  "debit": "<header_name_or_empty_string>",
  "account": "<header_name_or_empty_string>",
  "description": "<header_name_or_empty_string>"
}
</mapping>
`;
