exports.generateGUID = () => {
  const generatePiece = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)

  return generatePiece() + generatePiece() + '-' + generatePiece() + '-' + generatePiece() + '-' + generatePiece() + '-' + generatePiece() + generatePiece() + generatePiece()
}

exports.isFunction = object => !!(object && object.constructor && object.call && object.apply)
