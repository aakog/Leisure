define(['./prism'], function(){
Prism.languages.leisure = {
	'comment': /#[^\r\n]*(\r?\n|$)/g,
	'string': /("|')(\\?.)*?\1/g,
	'keyword': /\b(\%|\*|\+|\+\+|\-|\-\-|\:|\<|\<\=|\=\=|\>|\>\=|\[|\^|_1of2|_1of3|_1of4|_2of2|_2of3|_2of4|_3of3|_3of4|_4of4|_jsonParse|_regexp|_regexpFlags|_show|_strAdd|_strAsc|_strAt|_strCat|_strChr|_strFromList|_strLen|_strMatch|_strReplace|_strSplit|_strStartsWith|_strSubstring|_strToList|_strToLowerCase|_strToUpperCase|abs|absorbArgument|acons|aconsPair|aconsf|acos|actor|addDataAfter|addFilepos|addInfixProp|addParseFilter|addProps|addStdTokenPacks|addToken|addTokenGroup|advise|afetch|alert|all|and|and\[|anno|any|append|appendAlist|apply|aremove|arity|asIO|asin|assert|assertAlist|assertLog|assertType|assoc|assocGetWithDefault|ast2Json|ast2Json|astFileWrap|at|atan|atan2|backslashCodes|backslashValues|baseLoad|baseLoadString|baseMacroSub|basename|basicSplitTokens|bind|bind2|bindCons|bindEvent|bindRepeat|blockStarts|blueStyle|bodyStructPat|border|box|breakpoint|ceil|chainApply|checkSetDataType|circle|cleanTokens|clearNameSpacePath|cleave|compose|computeTokenPat|concatFlat\[|concat\[|config|cons|consifyMacroValue|contains|convertStringEscape|convertStringEscapes|cos|count|countFilePos|countIf|countIfNot|countedLines|countedLinesForFile|countedParseLine|countedRunLine|countedRunLines|countedScanLineG|countedScanLineM|countedScanLines|countedTokens|createAnno|createApply|createApplyNode|createAst|createDef|createLambda|createLambdaNode|createLet|createLitNode|createLitOrRef|createRefNode|createSublets|defCase|defMacro|defMacro|defPat|defTokenPack|defWrapper|defaultCircleMap|defaultEllipseMap|defaultLineMap|defaultPolygonMap|defaultRectMap|defaultTextMap|defer|define|definitionList|delay|deleteValue|delimiterListPrefix|digit|dl|dlAppend|dlPush|dlempty|do|doClause|doall|drop|dropLast|dropWhile|ellipse|emptyFilePos|emptyFor|emptyLinePat|emptyLineStarts|emptyToken|envDelete|envGet|envGetOr|envHas|envSet|eq|err|errMsg|error|escapeHtml|evens|fakereturn|false|field|filePosFor|filepos|fileposFile|fileposLine|fileposList|fileposOffset|filter|filterApplies|filterApplyElements|filterBlock|filterLambda|filterLet|filterLetBinding|find|findIndex|findLines|findOption|finishLoading|flatten|flip|floor|foldl|foldl1|foldr|foldr1|from|fromBy|fromJson|fromTo|fromToBy|funcInfo|funcList|funcName|funcSrc|funcs|gdriveOpen|genAst|gensym|getAnnoBody|getAnnoData|getAnnoName|getApplyArg|getApplyFunc|getBaseDataNamed|getDataType|getDataType|getDocument|getFilename|getFunction|getHtml|getLambdaBody|getLambdaName|getLambdaRange|getLetBody|getLetLambda|getLetName|getLetNames|getLetRange|getLetValue|getLink|getLitRange|getLitValue|getNameAndDef|getPrec|getProperties|getProperty|getRefName|getRefRange|getType|getURI|getValue|getValueOr|grabLeftOfArrow|greenStyle|group|hamt|hamtFetch|hamtGet|hamtPairs|hamtWith|hamtWithPair|hamtWithout|hamtify|hamt{|handleDo|hasProperty|hasType|hasValue|head|highlight|html|html|id|idx|ifNotErr|increasing|incrementField|index|infix|infixRearrange|infixShouldEatNext|insertFields|insertSorted|intercalate|intersperse|iprec|isAlist|isBlockStart|isCons|isEither|isEmptyPos|isErr|isFilepos|isInfix|isInfixArg|isList|isNil|isNone|isNumber|isOption|isParens|isParseErr|isSome|isSome2|isString|isToken|isTokenStart|isTokenString|iszero|join|js|js\[|json2Ast|jsonParse|jsonStringify|jsonToYaml|keys|lambda|last|left|length|let|lexEnd|line|linePat|lineScrub|linesForFile|listFilter|listFilterTail|listMacroFoldOp|listify|listifyOp|lit|load|loadJS|loc|log|logStack|macroParse|macroSub|macroSubBody|macroSubLet|macroSubM|makeCaseArgs|makeCaseCondition|makeMoreTokens|makeNode|makeParens|makeTokenAt|makeTokens|map|mapSave|markupButtons|matchOffset|max|merge|mergeSort|min|mkStr|namesForLines|naturals|neq|newCodeContent|newDefine|newGen|newParseLine|newline|nil|nilRange|nodeFor|nodeHeight|nodeLine|nodeRootX|nodeRootY|nodeSvg|nodeTranslate|nodeWidth|none|not|notebookAst|notebookSelection|number|numberPat|odds|once|or|or\[|override|parenGroups|parens|parensContent|parensEnd|parensFromToks|parensStart|parseErr|parseErrMsg|parseFile|parseG|parseGroup|parseIndent|parseLine|parseLineG|parseLineM|parseLines|parseM|parseString|parseToAst|parseTok|parseToks|polygon|position|positive|postProcessMacro|present|presentFunction|presentHtml|print|print2|printValue|prompt|prompt2|protect|pushNameSpace|qs|quit|rand|rand|randInt|rangeContainsRange|rassoc|readDir|readFile|rect|redStyle|ref|regexp|regexpEscapePat|regexpFlags|remove|removeIf|removeLast|repeat|replaceDocument|require|requireJS|resetNameSpaceInfo|resetStdTokenPacks|resetTokenPacks|resultOfRun|rev|reverse|right|rightAssoc|rotate|round|runAst|runFile|runLine|runLines|runNamedFile|runParseFilters|runRepeat|scanFile|scanLine|scanLineG|scanLineM|scrub|scrubList|send|series|setBaseDataNamed|setDataTypeAnno|setNameSpace|setNameSpaceInfo|setParens|setPrecedenceLevels|setProperty|setTheme|setTypeAnno|setURI|setValue|show|show|showBase|showConsElements|showHtml|showPos|showToken|simpleScanLine|simplify|sin|slowsort|some|some2|sort|sortBy|space|spliceFuncProps|splitTokens|sqrt|startFilePos|statFile|strAdd|strAsc|strAt|strCat|strChr|strFromList|strLen|strMatch|strMatches|strReplace|strSplit|strStartsWith|strString|strSubstring|strToList|strToLowerCase|strToUpperCase|strTokenString|string|stripParens|subSpliceFuncProps|subbind|subflatten|svg|svgConcat|svgElement|svgFile|svgMeasure|svgMeasureText|svgNode|svgNodes|svgPresent|svgTemplate|tail|take|takeWhile|tan|testParse|text|textNode|toJson|toJsonArray|toJsonObject|toYaml|toggleLeisureBar|toggleLeisureBar|toggleSlides|tokListStr|token|tokenFilepos|tokenPos|tokenString|tokens|tokensM|trace|trackCreation|trackVars|trampoline|trampolineCall|transformDef|translate|treeFor|treeForWith|true|unanchoredDefPat|unescapeHtml|unit|useTokenPack|visit|when|wholes|withCons|withParens|withStripped|withToken|wrap|wrappedTreeFor|write|writeFile|zip|\{|\]\})\b/g,
	'constant': /\b(nil|true|false)\b/g,
	'number': /-?\b([0-9]*\.?[0-9]+)\b/g
};

    return null;
});
