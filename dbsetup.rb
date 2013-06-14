load 'models.rb'
require 'data_mapper'

DataMapper::Logger.new($stdout, :debug)
load 'connect.rb'
DataMapper.auto_migrate!
