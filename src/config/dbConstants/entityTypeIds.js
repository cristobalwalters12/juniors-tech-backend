const ROLE_TYPES = {
  USER: {
    id: '2SbUCqylYo',
    name: 'usuario'
  },
  MOD: {
    id: '8h5NIrFj4K',
    name: 'moderador'
  },
  ADMIN: {
    id: 'iBM3mRqi3F',
    name: 'administrador'
  }
}

const ASPECT_TYPES = {
  POST: 'pOcG-XWN58',
  COMMENT: 'm6udpXPOt6'
}

const REPORT_TYPES = {
  POST: 'eXx8aFdM6E',
  COMMENT: 'FciMP7nq18',
  USER: 'aSRB2RNW9K'
}

const REPORT_ACTIONS = {
  DEACTIVATE_ACCOUNT: 'toUoxwUTrg',
  IGNORE_REPORT: 'J9s14lchjO',
  DELETE_COMMENT: 'b5lHGSAcTV',
  DELETE_POST: 'rIDwcR6GbB',
  MUTE_USER: '4BhmLIjTLQ'
}

export { REPORT_TYPES, ASPECT_TYPES, ROLE_TYPES, REPORT_ACTIONS }
