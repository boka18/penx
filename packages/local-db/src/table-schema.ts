import { TableType } from '@penx/indexeddb/src/types'

export const tableSchema: TableType[] = [
  {
    name: 'space',
    primaryKey: {
      name: 'id',
      autoIncrement: false,
      unique: true,
    },
    indexes: {
      name: {
        unique: false,
      },
    },
    timestamps: true,
  },
  {
    name: 'doc',
    primaryKey: {
      name: 'id',
      autoIncrement: false,
      unique: true,
    },
    indexes: {
      spaceId: {
        unique: false,
      },
    },
    timestamps: true,
  },

  {
    name: 'file',
    primaryKey: {
      name: 'id',
      autoIncrement: false,
      unique: true,
    },
    indexes: {
      spaceId: {
        unique: false,
      },
    },
    timestamps: true,
  },

  {
    name: 'extension',
    primaryKey: {
      name: 'id',
      autoIncrement: false,
      unique: true,
    },
    indexes: {
      spaceId: {
        unique: false,
      },
    },
    timestamps: true,
  },
]