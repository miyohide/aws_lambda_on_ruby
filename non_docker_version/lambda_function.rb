#require 'pg'
require 'active_support/all'

module LambdaFunction
  class Handler
    def self.process(event:,context:)
      p "".blank?
      "Hello from Lambda!"
    end
  end
end
