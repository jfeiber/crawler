import threading
from sqlalchemy import Table, create_engine

class SupervisorThread(threading.Thread):
	def __init__(self, linkToCrawl):
		super(SupervisorThread, self).__init__()
		self.linkToCrawl = linkToCrawl
		self.db = create_engine('postgres://yvjcpskpyvougu:AAjg7EhphZtmcLAJ2UQgYrtaiX@ec2-54-243-224-162.compute-1.amazonaws.com:5432/dchofrh486l0gi')

	def run(self):
		