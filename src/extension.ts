// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { WarehouseType, format } from "./format";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const formatterProvider = {
    provideDocumentFormattingEdits(
      document: vscode.TextDocument,
      options: vscode.FormattingOptions,
      token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.TextEdit[]> {
      if (token.isCancellationRequested) {
        return [];
      }

      const formattedText = format(document.getText(), "sqlx", {
        ...options,
        keywordCase: getKeywordCase(),
        warehouse: getWarehouse(),
      });

      const range = new vscode.Range(0, 0, document.lineCount, 0);
      return [vscode.TextEdit.replace(range, formattedText)];
    },
  };

  const selector = { language: "sqlx" };

  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider(
      selector,
      formatterProvider
    )
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}

function getKeywordCase(): "upper" | "lower" | "preserve" {
  const config = vscode.workspace.getConfiguration("sqlx-formatter");
  return config.get("keywordCase", "upper");
}

function getWarehouse(): WarehouseType {
  const config = vscode.workspace.getConfiguration("sqlx-formatter");
  return config.get("warehouse", "bigquery");
}
