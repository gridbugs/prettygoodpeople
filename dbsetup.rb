load 'models.rb'
require 'data_mapper'

DataMapper::Logger.new($stdout, :debug)
DataMapper.setup(:default, 'mysql://steve@localhost/test')

DataMapper.auto_migrate!
