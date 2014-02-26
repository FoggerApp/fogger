#!/usr/bin/python
# -*- coding: utf-8 -*-

import sys
import os
import unittest

web2py_path = '../../..'
sys.path.append(os.path.realpath(web2py_path))
os.chdir(web2py_path)
from gluon.contrib.webclient import WebClient

class TestDefaultController(unittest.TestCase):
    def setUp(self):
        self.client = WebClient('http://127.0.0.1:8000/fogger/default/',
                   postbacks=True)

    def testRetrievePeopleFromDatabase(self):
        # login again
        data = dict(username='testuser',
                    password='testpass',
                    _formkey='login')
        self.client.post('user/login', data=data)
        print self.client.text
        # check registration and login were successful
        self.client.get('people')

        print self.client.text

if __name__ == '__main__':
    unittest.main()