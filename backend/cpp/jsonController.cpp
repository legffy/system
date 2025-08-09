#include <iostream>
#include <fstream>
#include <string>
std::string getTitle(std::string &line)
{
    // Find the position where "title" appears.
    size_t key_start = line.find("title");
    if (key_start == std::string::npos)
    {
        return "";
    }
    // Calculate the starting index of the title value.
    int value_start = key_start + 9;
    // Find the ending title
    int value_end = line.find(",", value_start)-1;
    int len = value_end - value_start;
    // Extract and return the title substring.
    std::string title = line.substr(value_start, len);
    return title;
}

int main(int argc, char* argv[]){
    std::ifstream jsonFile("../output.txt");
    std::string line;
    while(std::getline(jsonFile,line)){
        std::cout << "Title begin:" << getTitle(line) << std::endl;
    }
}