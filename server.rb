require 'rubygems'
require 'sinatra'
require 'data_mapper'


set :bind, 'localhost'
set :port, 4567

# connect to database
DataMapper::Logger.new($stdout, :debug)
DataMapper.setup(:default, 'mysql://steve@localhost/test')
load 'models.rb'

DataMapper::Model.raise_on_save_failure = true 

# non-kernel calls
get '/' do
  redirect '/index.html'
end

# kernel calls
get '/get-public-key' do
end

post '/update-public-key' do
end

get '/get-messages' do
end

get '/get-message-count' do
end

post '/add-user' do
  username = params[:username]
  password = params[:password]
  publickey = params[:publickey]

  puts User.create(:username => username, :password => password, :publickey => publickey)
end

post '/remove-user' do
end

post '/send-message' do
end

post '/remove-user' do
end
