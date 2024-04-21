class ChessPiece {
    constructor(color, x, y, idt) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.idt = idt;

        if (color === 'W') {
            this.suf = 'white';
        } else if (color === 'black') {
            this.suf = 'black';
        }
    }
}

class Pawn extends ChessPiece {
    constructor(color, x, y, idt) {
        super(color, x, y, idt);
        this.pieceType = "pawn";
        this.file = `pawn_${this.suf}.png`;
        this.canDoubleMove = true;
    }

    move(newX, newY, board, checkMove = false) {
        if (newX < 0 || newX > 7 || newY < 0 || newY > 7) {
            return false;
        }

        if (newX === this.x && newY === this.y) {
            return false;
        }

        const sameCol = (newX === this.x);

        if (this.color === 'W') {
            const goodMove = (newY === this.y + 1 || (newY === this.y + 2 && this.canDoubleMove));
            const emptyDest = !board[newX, newY].piece;

            const atkLeft = board[newY][newX].piece && board[newY][newX].piece.color === "B" && newX === this.x - 1 && newY === this.y + 1;
            const atkRight = board[newY][newX].piece && board[newY][newX].piece.color === "B" && newX === this.x + 1 && newY === this.y + 1;
        }
    }
}