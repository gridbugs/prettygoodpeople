load 'models.rb'
require 'dm-migrations'

DataMapper::Logger.new($stdout, :debug)
DataMapper.setup(:default, 'mysql://steve@localhost/test')

DataMapper.auto_migrate!
