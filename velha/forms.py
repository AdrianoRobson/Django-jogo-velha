from django import forms


class SecaoGameForm(forms.Form):

    CHOICE_GAMER = (
        ('', 'escolha...'),
        ('X', 'X'),
        ('O', 'O'),
    )

    room_code = forms.CharField(label='Seção', max_length=100)
    gamer = forms.CharField(label='Gamer', max_length=1, widget=forms.Select(choices=CHOICE_GAMER),)

    class Meta:
        verbose_name = 'Seção'
        verbose_name_plural = 'Seções'






