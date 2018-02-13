import { IStyleAPI, IStyleItem } from 'import-sort-style'

interface IImport {
    start: number
    end: number
    importStart?: number
    importEnd?: number
    type: ImportType
    moduleName: string
    defaultMember?: string
    namespaceMember?: string
    namedMembers: NamedMember[]
}

declare type ImportType = 'import' | 'require' | 'import-equals' | 'import-type'
declare type NamedMember = {
    name: string
    alias: string
}

export default function (styleApi: IStyleAPI): IStyleItem[] {
    const {
        alias,
        and,
        not,
        dotSegmentCount,
        hasNoMember,
        isAbsoluteModule,
        isNodeModule,
        isRelativeModule,
        moduleName,
        naturally,
        unicode,
    } = styleApi

    function isEmberModule (imported: IImport) {
        return imported.moduleName.startsWith('@ember')
    }

    return [
        // import "foo"
        { match: and(hasNoMember, isAbsoluteModule) },
        { separator: true },

        // import "./foo"
        { match: and(hasNoMember, isRelativeModule) },
        { separator: true },

        // import … from "fs"
        {
            match: isNodeModule,
            sort: moduleName(naturally),
            sortNamedMembers: alias(unicode),
        },
        { separator: true },

        // import … from "@ember/foo"
        {
            match: isEmberModule,
            sort: moduleName(naturally),
            sortNamedMembers: alias(unicode),
        },
        { separator: true },

        // import … from "foo"
        {
            match: and(isAbsoluteModule, not(isEmberModule)),
            sort: moduleName(naturally),
            sortNamedMembers: alias(unicode),
        },
        { separator: true },

        // import … from "./foo"
        // import … from "../foo"
        {
            match: isRelativeModule,
            sort: [dotSegmentCount, moduleName(naturally)],
            sortNamedMembers: alias(unicode),
        },
        { separator: true },
    ]
}
