/*
-------------------------------------- PIECES AND MOVEMENTS --------------------------------------
Pawn - It may move one square directly forward, it may move two squares directly forward on its first move, and it may capture one square diagonally forward.
Rook - The rook can move forward, backward or sideways, but cannot move diagonally.
Knight - It either moves up or down one square vertically and over two squares horizontally OR up or down two squares vertically and over one square horizontally. This movement can be remembered as an "L-shape" because it looks like a capital "L".
Bishop - The bishop moves diagonally in any direction it wishes and as far as it wishes as long as the squares are free. If an opposing piece blocks its way the bishop can capture it and occupy its square.
King - the king can move one square in any direction, including horizontally, vertically, or diagonally. However, the king can only move one square at a time and cannot move into a square that is being attacked by an opponent's piece.
Queen - The Queen can move 1-7 squares in any direction, up, down, left, right, or diagonal, until the Queen reaches an obstruction or captures a piece; however, the Queen cannot jump over pieces and can only capture one piece per turn.
-------------------------------------- MOVE DEFINITIONS --------------------------------------
Castling kingside (short castling) consists of moving the king to g1 and the rook to f1 for White, or moving the king to g8 and the rook to f8 for Black.
Castling queenside (long castling) consists of moving the king to c1 and the rook to d1 for White, or moving the king to c8 and the rook to d8 for Black
*/

const board = [
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['_', '_', '_', '_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_', '_', '_', '_'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']
];

function isPieceAt(position) {
    const { x, y } = position;
    
    if (x < 0 || x >= 8 || y < 0 || y >= 8) {
        return false;
    }

    const piece = board[y][x];
    return piece !== '_';
}

class ChessBoard {
    constructor(board) {
        this.board = board;
    }

    isUnderAttack(position, color) {
        const { x, y } = position;

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = this.board[i][j];

                if (piece !== null && piece.color !== color) {
                    if (piece.isMoveValid(position, this.board, piece.position)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }
}

class Pawn extends ChessPiece {
    constructor(color, position) {
        super(color, 'pawn', position);
        this.hasMoved = false;
    }

    isMoveValid(newPosition, board, currentPosition) {
        const diffX = newPosition.x - currentPosition.x;
        const diffY = newPosition.y - currentPosition.y;
        const direction = (this.color === 'white') ? 1 : -1;

        if (newPosition.x < 0 || newPosition.x >= 8 || newPosition.y < 0 || newPosition.y >= 8) {
            return false;
        }

        if (board[newPosition.y][newPosition.x] !== null && board[newPosition.y][newPosition.x].color === this.color) {
            return false;
        }

        if (diffX === 0 && diffY === direction && board[newPosition.y][newPosition.x] === null) {
            return true;
        }

        if (!this.hasMoved && diffX === 0 && diffY === 2 * direction && board[newPosition.y][newPosition.x] === null) {
            const intermediatePosition = { x: currentPosition.x, y: currentPosition.y + direction };

            if (board[intermediatePosition.y][intermediatePosition.x] !== null) {
                return false;
            }
            return true;
        }

        if (Math.abs(diffX) === 1 && diffY === direction && board[newPosition.y][newPosition.x] !== null && board[newPosition.y][newPosition.x].color !== this.color) {
            return true;
        }

        return false;
    }

    move(newPosition) {
        if (this.isMoveValid(newPosition)) {
            this.position = newPosition;
            this.hasMoved = true;
            return true;
        } else {
            return false;
        }
    }
}

class Rook extends ChessPiece {
    constructor(color, position) {
        super(color, 'rook', position);
    }

    isValidMove(newPosition, board, currentPosition) {
        const diffX = newPosition.x - currentPosition.x;
        const diffY = newPosition.y - currentPosition.y;

        if (newPosition.x < 0 || newPosition.x >= 8 || newPosition.y < 0 || newPosition.y >= 8) {
            return false;
        }

        if (board[newPosition.y][newPosition.x] !== null && board[newPosition.y][newPosition.x].color === this.color) {
            return false;
        }

        if (diffX === 0 || diffY === 0) {
            const directionX = Math.sign(diffX);
            const directionY = Math.sign(diffY);

            let currentX = currentPosition.x + directionX;
            let currentY = currentPosition.y + directionY;

            while (currentX !== newPosition.x || currentY !== newPosition.y) {
                if (board[currentY][currentX] !== null) {
                    return false;
                }
                currentX += directionX;
                currentY += directionY;
            }

            return true;
        }

        return false;
    }

    move(newPosition) {
        if (this.isMoveValid(newPosition)) {
            this.position = newPosition;
            this.hasMoved = true;
            return true;
        } else {
            return false;
        }
    }
}

class Knight extends ChessPiece {
    constructor (color, position) {
        super(color, 'knight', position);
    }

    isValidMove(newPosition, board, currentPosition) {
        const diffX = Math.abs(newPosition.x - currentPosition.x);
        const diffY = Math.abs(newPosition.y - currentPosition.y);

        if (newPosition.x < 0 || newPosition.x >= 8 || newPosition.y < 0 || newPosition.y >= 8) {
            return false;
        }

        if (board[newPosition.y][newPosition.x] !== null && board[newPosition.y][newPosition.x].color === this.color) {
            return false;
        }

        return (diffX === 1 && diffY === 2) || (diffX === 2 && diffY === 1);
    }

    move(newPosition) {
        if (this.isMoveValid(newPosition)) {
            this.position = newPosition;
            this.hasMoved = true;
            return true;
        } else {
            return false;
        }
    }
}

class Bishop extends ChessPiece {
    constructor (color, position) {
        super(color, 'bishop', position);
    }

    isValidMove(newPosition, board, currentPosition) {
        const diffX = newPosition.x - currentPosition.x;
        const diffY = newPosition.y - currentPosition.y;

        if (newPosition.x < 0 || newPosition.x >= 8 || newPosition.y < 0 || newPosition.y >= 8) {
            return false;
        }

        if (board[newPosition.y][newPosition.x] !== null && board[newPosition.y][newPosition.x].color === this.color) {
            return false;
        }

        return Math.abs(diffX) === Math.abs(diffY);
    }

    move(newPosition) {
        if (this.isMoveValid(newPosition)) {
            this.position = newPosition;
            this.hasMoved = true;
            return true;
        } else {
            return false;
        }
    }
}

class King extends ChessPiece {
    constructor(color, position) {
        super(color, 'king', position);
    }

    isValidMove(newPosition, board, currentPosition) {
        const diffX = newPosition.x - currentPosition.x;
        const diffY = newPosition.y - currentPosition.y;

        if (newPosition.x < 0 || newPosition.x >= 8 || newPosition.y < 0 || newPosition.y >= 8) {
            return false;
        }

        if (board[newPosition.y][newPosition.x] !== null && board[newPosition.y][newPosition.x].color === this.color) {
            return false;
        }

        return Math.abs(diffX) <= 1 && Math.abs(diffY) <= 1;
    }

    move(newPosition) {
        if (this.isMoveValid(newPosition)) {
            this.position = newPosition;
            this.hasMoved = true;
            return true;
        } else {
            return false;
        }
    }

    castle(rookPosition) {
        if (this.type === 'king' && !this.hasMoved) {
            const diffX = Math.abs(rookPosition.x - this.position.x);
            const diffY = Math.abs(rookPosition.y - this.position.y);

            if (diffY === 0 && diffX === 3) {
                let deltaX = (rookPosition.x > this.position.x) ? 1 : -1;
                let currentX = this.position.x + deltaX;

                while (currentX !== rookPosition.x) {
                    if (isPieceAt({ x: currentX, y: this.position.y })) {
                        return false;
                    }

                    currentX += deltaX;
                }

                if (isUnderAttack(this.position) || isUnderAttack(rookPosition)) {
                    return false;
                }
    
                this.position.x = rookPosition.x;
                return true;
            }
        }

        return false;
    }
}

class Queen extends ChessPiece {
    constructor(color, position) {
        super(color, 'queen', position);
    }

    isValidMove(newPosition, board, currentPosition) {
        const diffX = newPosition.x - currentPosition.x;
        const diffY = newPosition.y - currentPosition.y;

        if (newPosition.x < 0 || newPosition.x >= 8 || newPosition.y < 0 || newPosition.y >= 8) {
            return false;
        }

        if (board[newPosition.y][newPosition.x] !== null && board[newPosition.y][newPosition.x].color === this.color) {
            return false;
        }

        if (diffX === 0 || diffY === 0 || Math.abs(diffX) === Math.abs(diffY)) {
            const directionX = Math.sign(diffX);
            const directionY = Math.sign(diffY);

            let currentX = currentPosition.x + directionX;
            let currentY = currentPosition.y + directionY;

            while (currentX !== newPosition.x || currentY !== newPosition.y) {
                if (board[currentY][currentX] !== null) {
                    return false; // There's a piece blocking the path
                }
                currentX += directionX;
                currentY += directionY;
            }

            return true;
        }

        return false;
    }

    move(newPosition) {
        if (this.isMoveValid(newPosition)) {
            this.position = newPosition;
            this.hasMoved = true;
            return true;
        } else {
            return false;
        }
    }
}