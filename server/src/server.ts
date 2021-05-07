/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { getLanguageService } from 'vscode-html-languageservice';
import { createConnection, InitializeParams, ProposedFeatures, TextDocuments, TextDocumentSyncKind } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

// Create a connection for the server. The connection uses Node's IPC as a transport.
// Also include all preview / proposed LSP features.
let connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager. The text document manager
// supports full document sync only
let documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

const htmlLanguageService = getLanguageService();

connection.onInitialize((_params: InitializeParams) => {
	return {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Full,
			// Tell the client that the server supports code completion
			completionProvider: {
				resolveProvider: false
			},
			hoverProvider: true
		}
	};
});

connection.onInitialized(() => { });

connection.onCompletion(async (textDocumentPosition, token) => {
	const document = documents.get(textDocumentPosition.textDocument.uri);
	if (!document) {
		return null;
	}


	return htmlLanguageService.doComplete(
		document,
		textDocumentPosition.position,
		htmlLanguageService.parseHTMLDocument(document)
	);
});

connection.onHover(async (params) => {
	return { contents: "Hello world!" };
});

documents.listen(connection);
connection.listen();