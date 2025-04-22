function patrat(n) {
    i = 0;
    while (i < 5) {
        linie = '';
        j = 0;
        while (j < n) {
            linie += '* ';
            j++;
        }
        console.log(linie);
        i++;
    }
}
patrat(5);
