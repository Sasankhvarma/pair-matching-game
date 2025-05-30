angular.module('PairGameApp')
.controller('GameController', function($timeout) {
    const vm = this;

    vm.size = 2; // Default grid size (4x4)

    vm.resetGame = function() {
        if(vm.size % 2 !== 0 || vm.size < 2) {
            vm.message = "Please enter an even number >= 2 for grid size.";
            vm.board = [];
            return;
        }
        const n = vm.size;
        const totalPairs = (n * n) / 2;
        const numbers = [];

        for (let i = 1; i <= totalPairs; i++) {
            numbers.push(i);
            numbers.push(i);
        }

        // Shuffle array
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }

        vm.board = numbers.map(num => ({
            value: num,
            revealed: false,
            matched: false
        }));

        vm.firstIndex = null;
        vm.message = "Match all numbers consecutively!";
    };

    vm.selectCell = function(index) {
        const cell = vm.board[index];

        if (cell.matched || cell.revealed) return;

        cell.revealed = true;

        if (vm.firstIndex === null) {
            vm.firstIndex = index;
        } else {
            const firstCell = vm.board[vm.firstIndex];

            if (firstCell.value === cell.value) {
                firstCell.matched = true;
                cell.matched = true;
                vm.message = "Great! You found a pair.";

                if (vm.board.every(c => c.matched)) {
                    vm.message = "🎉 You won!";
                }
            } else {
                vm.message = "Wrong match. Try again.";
                $timeout(() => {
                    firstCell.revealed = false;
                    cell.revealed = false;
                }, 600);
            }

            vm.firstIndex = null;
        }
    };

    vm.resetGame(); // Initialize game
});
