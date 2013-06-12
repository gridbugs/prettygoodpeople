require 'rubygems'
require 'sinatra'

set :bind, 'localhost'
set :port, 4567

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

  puts username
  puts password
  puts publickey
end

post '/remove-user' do
end

post '/send-message' do
end

post '/remove-user' do
end
