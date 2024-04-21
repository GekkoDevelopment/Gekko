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

            if (sameCol && goodMove && emptyDest) {
                if (!checkMove) {
                    this.x = newX;
                    this.y = newY;
                }

                this.canDoubleMove = false;
                return true;
            }

            if (atkRight || atkLeft) {
                if (!checkMove) {
                    this.x = newX;
                    this.y = newY;
                }

                this.canDoubleMove = false;
                return true;
            }
        } else if (this.color === 'B') {
            const goodMove = (newY === this.y - 1 || (newY === this.y - 2 && this.canDoubleMove));
            const emptyDest = !board[newY][newX].piece;
            const atkLeft = board[newY][newX].piece && board[newY][newX].piece.color === "W" && newX === this.x - 1 && newY === this.y - 1;
            const atkRight = board[newY][newX].piece && board[newY][newX].piece.color === "W" && newX === this.x + 1 && newY === this.y - 1;
            
            if (sameCol && goodMove && emptyDest) {
                if (!checkMove) {
                    this.x = newX;
                    this.y = newY;    
                }

                this.canDoubleMove = false;
                return;
            }

            if (atkRight || atkLeft) {
                if (!checkMove) {
                    this.x = newX;
                    this.y = newY;
                }

                this.canDoubleMove = false;
                return true;
            }
        } 

        return false;
    }
}

class Rook extends ChessPiece {
    constructor(color, x, y, idt) {
        super(color, x, y, idt);
        this.pieceType = 'rook';
        this.file = `rook_${this.suf}.png`;
        this.canCastle = true;
    }

    move(newX, newY, board, checkMove = false) {
        if (newX < 0 || newX > 7 || newY < 0 || newY > 7) {
            return false;
        }

        if (newX === this.x && newY === this.y) {
            return false;
        }

        if (newX !== this.x && newY !== this.y) {
            return false;
        }

        const newCellPiece = board[newY][newX].piece;
        
        if (!newCellPiece) {
            // do nothing
        } else if (newCellPiece.color === this.color) {
            return false;
        }

        if (newX === this.x) {
            const scanStart = Math.min(this.y, newY) + 1;
            const scanEnd = Math.max(this.y, newY);
            
            for (let tempY = scanStart; tempY < scanEnd; tempY++) {
                if (board[tempY][newX].piece) {
                    return false;
                }
            }

            if (!checkMove) {
                this.x = newX;
                this.y = newY;
            }

            this.canCastle = false;
            return true;
        }

        if (newY === this.y) {
            const scanStart = Math.min(this.x, newX) + 1;
            const scanEnd = Math.max(this.x, newX);

            for (let tempX = scanStart; tempX < scanEnd; tempX++) {
                if (board[newY][tempX].piece) {
                    return false;
                }
            }

            if (!checkMove) {
                this.x = newX;
                this.y = newY;
            }

            this.canCastle = false;
            return true;
        }

        return false;
    }

    castling(kingX, kingY, board) {
        let toIter;
        let castleType;
        
        if (this.x === 0) {
            toIter = [1, 2, 3];
            castleType = "big";
        } else if (this.x === 7) {
            toIter = [5, 6];
            castleType = "small";
        }

        for (let i of toIter) {
            if (board[kingY][i].piece) {
                return [false, null];
            }
        }

        return [true, castleType];
    }
}

class Bishop extends ChessPiece {
    constructor(color, x, y, idt) {
        super(color, x, y, idt);
        this.pieceType = "bishop";
        this.file = "bishop_" + this.suf + ".png";
    }

    move (newX, newY, board, checkMove = false) {
        const xDist = Math.abs(newX - this.x);
        const yDist = Math.abs(newY - this.y);

        if (newX < 0 || newY > 7 || newY < 0 || newX > 7) {
            return false;
        }

        if (xDist !== yDist) {
            return false;
        }

        const newCellPiece = board[newX][newY].piece;
        
        if (newCellPiece === null) {
            // do nothing
        } else if (newCellPiece.color === this.color) {
            return false;
        }

        let xMod, yMod;

        if (newX > this.x && newY > this.y) {
            xMod = 1;
            yMod = 1;
        } else if (newX > this.x && newY < this.y) {
            xMod = 1;
            yMod = -1;
        } else if (n < this.x && newY > this.y) {
            xMod = -1;
            yMod = 1;
        } else if (n < this.x && newY < this.y) {
            xMod = -1;
            yMod = -1;
        }

        let xScan = this.x;
        let yScan = this.y;

        for (let i = 0; i < xDist - 1; i++) {
            xScan += xMod;
            yScan += yScan;

            if (board[yScan][xScan].piece !== null) {
                return false;
            }
        }

        if (!checkMove) {
            this.x = newX;
            this.y = newY;
        }

        return true;
    }
}

class King extends ChessPiece {
    constructor(color, x, y, idt) {
        super(color, x, y, idt);
        this.pieceType = "king";
        this.file = "king_" + this.suf + ".png";
        this.canCastle = true;
        this.inCheck = false;
    }

    move(newX, newY, board, checkMove = false) {
        const xDist = Math.abs(newX - this.x);
        const yDist = Math.abs(newY - this.y);

        if (newX < 0 || newX > 7 || newY < 0 || newX > 7) {
            return false;
        }

        const newCellPiece = board[newY][newX].piece;

        if (newCellPiece === null) {
            // Do nothing
        } else if (newCellPiece.color === this.color) {
            return false;
        }

        if (!((xDist === 1 || yDist === 1) && xDist < 2 && yDist < 2)) {
            return false;
        }

        this.canCastle = false;
        if (!checkMove) {
            this.x = newX;
            this.y = newY;
        }
        return true;
    }

    isInCheck(board) {
        const danger = [];
        const knightCoords = [[2, 1], [2, -1], [-2, 1], [-2, -1]];

        for (const [xOffset, yOffset] of knightCoords) {
            const newX = this.x + xOffset;
            const newY = this.y + yOffset;
            
            if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
                const toAdd = board[newY][newX].piece;
                
                if (toAdd instanceof Knight && toAdd.color !== this.color) {
                    danger.push(toAdd);
                }
            }
        }

        const hor = board[this.y].map(cell => cell.piece);
        const ver = board.map(row => row[this.x].piece);

        let lPiece = null;
        
        for (let i = this.x - 1; i >= 0; i--) {
            if (hor[i] !== null) {
                lPiece = hor[i];
                break;
            }
        }

        let rPiece = null;
        
        for (let i = this.x + 1; i < 8; i++) {
            if (hor[i] !== null) {
                rPiece = hor[i];
                break;
            }
        }

        let dPiece = null;
        
        for (let i = this.y - 1; i >= 0; i--) {
            if (ver[i] !== null) {
                dPiece = ver[i];
                break;
            }
        }

        let uPiece = null;
        
        for (let i = this.y + 1; i < 8; i++) {
            if (ver[i] !== null) {
                uPiece = ver[i];
                break;
            }
        }

        const diag = [];
        for (let i = Math.max(0, this.x - this.y), j = Math.max(0, this.y - this.x); i < 8 && j < 8; i++, j++) {
            diag.push(board[j][i].piece);
        }

        let ruPiece = null;
        let ldPiece = null;
        
        let kingPassed = false;
        
        for (const cell of diag) {
            if (cell === this) {
                kingPassed = true;
                continue;
            }
            if (!kingPassed && cell !== null) {
                ruPiece = cell;
                continue;
            }
            if (kingPassed && cell !== null) {
                ldPiece = cell;
                continue;
            }
        }

        const revY = 7 - this.y;
        const diag2 = [];
        for (let i = Math.max(0, this.x - revY), j = Math.max(0, revY - this.x); i < 8 && j < 8; i++, j++) {
            diag2.push(board[j][i].piece);
        }

        let luPiece = null;
        let rdPiece = null;
        
        kingPassed = false;
        
        for (const cell of diag2) {
            if (cell === this) {
                kingPassed = true;
                continue;
            }
            if (!kingPassed && cell !== null) {
                luPiece = cell;
                continue;
            }
            if (kingPassed && cell !== null) {
                rdPiece = cell;
                continue;
            }
        }

        const pieces = [lPiece, rPiece, uPiece, dPiece, luPiece, rdPiece, ruPiece, ldPiece].filter(tmp => tmp !== null);

        danger.push(...pieces);
        const true_danger = [];
        
        for (const to_check of danger) {
            if (to_check.move(this.x, this.y, board, check_move = true)) {
                true_danger.push(to_check);
            }
        }

        if (true_danger.length === 0) {
            this.in_check = false;
            return [false, []];
        } else {
            this.in_check = true;
            return [true, true_danger];
        }
    }
}

class Knight extends ChessPiece {
    constructor(color, x, y, idt) {
        super(color, x, y, idt);
        this.piece_type = "knight";
        this.file = "knight_" + this.suf + ".png";
    }

    move(newX, newY, board, check_move = false) {
        if (newX < 0 || newX > 7 || newY < 0 || newY > 7) {
            return false;
        }

        const newCellPiece = board[newY][newX].piece;

        if (newCellPiece === null) {
            // Do nothing
        } else if (newCellPiece.color === this.color) {
            return false;
        }

        const moves = [];

        moves.push([this.x - 1, this.y + 2]);
        moves.push([this.x + 1, this.y + 2]);

        moves.push([this.x - 1, this.y - 2]);
        moves.push([this.x + 1, this.y - 2]);

        moves.push([this.x - 2, this.y - 1]);
        moves.push([this.x - 2, this.y + 1]);

        moves.push([this.x + 2, this.y - 1]);
        moves.push([this.x + 2, this.y + 1]);

        if (moves.some(move => move[0] === newX && move[1] === newY)) {
            if (!check_move) {
                this.x = newX;
                this.y = newY;
            }
            return true;
        } else {
            return false;
        }
    }
}