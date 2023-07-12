from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    def setUp(self):
        """Things to do before every test."""
        self.client = app.test_client()
        app.config['TESTING'] = True
    
    def test_homepage_start(self):
        """Test homepage loads: make sure info is in the session and HTML is displayed"""

        with self.client:
            response = self.client.get("/")
            self.assertIn('board', session)
            self.assertIsNone(session.get('highscore'))
            self.assertIsNone(session.get('nplays'))
            self.assertIn(b'<p>High Score:', response.data)
            self.assertIn(b'Score:', response.data)
            self.assertIn(b'Seconds Left:', response.data)
    
    def test_homepage(self):
        """Test if the word is valid by modifying the board in the session"""

        with self.client as client:
            with client.session_transaction() as sess:
                sess['board'] = [["C", "A", "T", "T", "T"], 
                                 ["C", "A", "T", "T", "T"], 
                                 ["C", "A", "T", "T", "T"], 
                                 ["C", "A", "T", "T", "T"], 
                                 ["C", "A", "T", "T", "T"]]
                response = self.client.get('/board/check?word=cat')
                self.assertEqual(response.json['result'], 'ok')
    
    def test_invalid_word(self):
        """Test if word is in dictionary"""

        self.client.get('/')
        response = self.client.get('/board/check?word=impossible')
        self.assertEqual(response.json['result'], 'not-on-board')

    
    def non_english_word(self):
        """Test if word is on the board"""

        self.client.get('/')
        response = self.client.get('/board/check?word=ydfahuigj')
        self.assertEqual(response.json['result'], 'not-word')



