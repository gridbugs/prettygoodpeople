require 'rubygems'
require 'data_mapper'
require 'json'

class User
  include DataMapper::Resource
  property :id, Serial
  property :username, String, :unique => true, :required => true
  property :publickey, Text, :required => true
  property :password, String, :required => true

  has n, :messages

  def to_json(*a)
    {
      :id => id,
      :username => username,
      :publickey => publickey,
      :password => password
    }.to_json(*a)
  end
end

class Message
  include DataMapper::Resource
  property :id, Serial
  property :body, Text, :required => true

  belongs_to :user
end

DataMapper.finalize
