const aesNode = jest.genMockFromModule('aes-node');

aesNode.encrypt104 = jest.fn();
aesNode.decrypt104 = jest.fn();

module.exports = aesNode;